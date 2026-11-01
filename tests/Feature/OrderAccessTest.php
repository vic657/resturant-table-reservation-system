<?php
namespace Tests\Feature;

use App\Models\{Waiter, KitchenManager};
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class OrderAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_waiter_can_serve_only_an_order_assigned_to_them(): void
    {
        $waiter = Waiter::create(['name' => 'Waiter', 'email' => 'waiter@example.test', 'password' => bcrypt('test-password')]);
        $other = Waiter::create(['name' => 'Other', 'email' => 'other@example.test', 'password' => bcrypt('test-password')]);
        $menuId = DB::table('menus')->insertGetId(['name' => 'Lunch', 'category' => 'foods', 'price' => 500]);
        $bookingId = DB::table('bookings')->insertGetId(['name' => 'Guest', 'date' => '2026-11-20', 'time' => '12:00', 'receipt_code' => 'TEST-RECEIPT']);
        $orderId = DB::table('orders')->insertGetId(['booking_id' => $bookingId, 'menu_id' => $menuId, 'name' => 'Lunch', 'price' => 500, 'quantity' => 1, 'subtotal' => 500, 'waiter_id' => $other->id]);
        $this->actingAs($waiter, 'sanctum');
        $this->putJson("/api/orders/$orderId/served", ['waiter_id' => $waiter->id])->assertForbidden();
        $this->assertDatabaseHas('orders', ['id' => $orderId, 'status' => 'pending', 'waiter_id' => $other->id]);
        DB::table('orders')->where('id', $orderId)->update(['waiter_id' => null]);
        $this->putJson("/api/orders/$orderId/served")->assertForbidden();
        DB::table('orders')->where('id', $orderId)->update(['waiter_id' => $waiter->id]);
        $this->putJson("/api/orders/$orderId/served")->assertOk();
        $this->assertDatabaseHas('orders', ['id' => $orderId, 'status' => 'served', 'waiter_id' => $waiter->id]);
    }

    public function test_kitchen_order_alias_resolves_before_account_id_route(): void
    {
        $manager = KitchenManager::create(['name' => 'Kitchen', 'email' => 'kitchen@example.test', 'password' => bcrypt('test-password')]);
        $this->actingAs($manager, 'sanctum')->getJson('/api/kitchen-managers/orders')->assertOk()->assertExactJson([]);
        $this->getJson('/api/kitchen-managers/bookings')->assertOk()->assertExactJson([]);
        $this->postJson('/api/kitchen-managers', [])->assertForbidden();
    }
}