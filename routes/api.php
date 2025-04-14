<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UserController;

Route::get('/users', [UserController::class, 'index']);
Route::post('/users/bulkDelete', [UserController::class, 'bulkDelete']);
Route::delete('/users/{id}', [UserController::class, 'delete']);
Route::put('/users/{id}', [UserController::class, 'update']);