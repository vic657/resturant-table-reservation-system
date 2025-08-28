<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('waiters', function (Blueprint $table) {
            $table->string('password')->after('email'); // add password column after email
        });
    }

    public function down(): void
    {
        Schema::table('waiters', function (Blueprint $table) {
            $table->dropColumn('password');
        });
    }
};
