<?php
namespace Tests\Feature;

use App\Models\{User, Waiter, KitchenManager, Security, Accountant};
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\{DB, Hash};
use Tests\TestCase;

class AccessControlTest extends TestCase
{
    use RefreshDatabase;

    public function test_staff_endpoints_require_authentication(): void
    {
        foreach (['/api/orders', '/api/bookings', '/api/waiters', '/api/kitchen-managers', '/api/menus', '/api/admin/waiters'] as $url) {
            $this->getJson($url)->assertUnauthorized();
        }
        $this->postJson('/api/kitchen-managers', [])->assertUnauthorized();
        $this->putJson('/api/orders/1/served', [])->assertUnauthorized();
    }

    public function test_staff_cannot_manage_accounts_or_other_waiters_orders(): void
    {
        $waiter = new Waiter(['name' => 'Test', 'email' => 'waiter@example.test']);
        $waiter->id = 1;
        $this->actingAs($waiter, 'sanctum');
        $this->postJson('/api/kitchen-managers', [])->assertForbidden();
        $this->getJson('/api/admin/waiters')->assertForbidden();
        $this->getJson('/api/menus')->assertForbidden();
        $this->getJson('/api/waiters/2/orders')->assertForbidden();
    }

    public function test_each_role_can_login_and_passwords_are_hidden(): void
    {
        foreach ([User::class => 'admin', KitchenManager::class => 'kitchen_manager', Waiter::class => 'waiter', Security::class => 'security', Accountant::class => 'accountant'] as $model => $role) {
            $user = new $model;
            $user->forceFill(['name' => 'Test Staff', 'email' => $role.'@example.test', 'password' => Hash::make('test-password')]);
            if ($model === User::class) $user->role = 'admin';
            $user->save();
            $this->postJson('/api/login', ['email' => $user->email, 'password' => 'test-password'])
                ->assertOk()->assertJsonPath('role', $role)->assertJsonMissingPath('user.password')->assertJsonStructure(['token']);
        }
    }

    public function test_logout_revokes_the_current_token(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('test');
        $this->withToken($token->plainTextToken)->postJson('/api/logout')->assertOk();
        $this->assertDatabaseMissing('personal_access_tokens', ['id' => $token->accessToken->id]);
    }

    public function test_login_is_throttled(): void
    {
        for ($i = 0; $i < 5; $i++) $this->postJson('/api/login', [])->assertUnprocessable();
        $this->postJson('/api/login', [])->assertStatus(429);
    }

    public function test_health_checks_database_and_hides_failures(): void
    {
        $this->getJson('/health')->assertOk()->assertExactJson(['status' => 'ok']);
        DB::shouldReceive('select')->once()->with('SELECT 1')->andThrow(new \RuntimeException('private connection details'));
        $this->getJson('/health')->assertStatus(503)->assertExactJson(['status' => 'unavailable']);
    }

    public function test_unknown_api_routes_return_json(): void
    {
        $this->getJson('/api/not-a-route')->assertNotFound()->assertExactJson(['message' => 'Not found.']);
    }
}