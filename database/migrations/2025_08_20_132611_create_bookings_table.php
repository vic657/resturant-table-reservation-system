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
    Schema::create('bookings', function (Blueprint $table) {
        $table->id();
        $table->string('area'); // indoor/outdoor
        $table->json('tables');
        $table->string('name');
        $table->string('email');
        $table->string('phone');
        $table->timestamps();
    });
}

    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
