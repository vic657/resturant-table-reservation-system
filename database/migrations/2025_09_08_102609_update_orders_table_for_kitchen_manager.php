<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::table('orders', function (Blueprint $table) {
        if (!Schema::hasColumn('orders', 'status')) {
            $table->string('status')->default('pending');
        }
        if (!Schema::hasColumn('orders', 'waiter_id')) {
            $table->unsignedBigInteger('waiter_id')->nullable();
            $table->foreign('waiter_id')->references('id')->on('waiters')->onDelete('set null');
        }
        if (!Schema::hasColumn('orders', 'items')) {
            $table->json('items')->nullable();
        }
        if (!Schema::hasColumn('orders', 'total')) {
            $table->decimal('total', 10, 2)->default(0);
        }
    });
}

public function down()
{
    Schema::table('orders', function (Blueprint $table) {
        $table->dropColumn(['status', 'items', 'total']);
        $table->dropForeign(['waiter_id']);
        $table->dropColumn('waiter_id');
    });
}

};
