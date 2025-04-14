<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Retrieve a paginated list of users, optionally filtered by search query.
     *
     * @param Request $request The incoming HTTP request.
     * @return \Illuminate\Http\JsonResponse Paginated users data in JSON format.
     */
    public function index(Request $request)
    {
        $search = $request->query('search'); 
        $perPage = $request->query('per_page', 10);
        $query = User::query()->orderBy('id', 'asc'); 

        if ($search) {
            $query->where('name', 'like', '%' . $search . '%');
        }

        $users = $query->paginate($perPage); 
        return response()->json($users);
    }

    /**
     * Delete a user by their ID.
     *
     * @param int $id The ID of the user to delete.
     * @return \Illuminate\Http\JsonResponse Success message in JSON format.
     */
    public function delete($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json(['message' => 'User deleted successfully.']);
    }

    /**
     * Update user information (name and email).
     *
     * @param Request $request The incoming HTTP request containing updated user data.
     * @param int $id The ID of the user to update.
     * @return \Illuminate\Http\JsonResponse The updated user data in JSON format.
     */
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
        ]);

        $user->update($validated);

        return response()->json(['message' => 'User updated successfully.', 'user' => $user]);
    }

    /**
     * Delete multiple users based on their IDs.
     *
     * @param Request $request The incoming HTTP request containing an array of user IDs to delete.
     * @return \Illuminate\Http\JsonResponse Success message after deletion.
     */
    public function bulkDelete(Request $request)
    {
        $ids = $request->input('ids', []);

        if (!is_array($ids) || empty($ids)) {
            return response()->json(['message' => 'No user IDs provided.'], 400);
        }

        User::whereIn('id', $ids)->delete();

        return response()->json(['message' => 'Selected users deleted successfully.']);
    }
}