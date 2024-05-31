<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\Api\SearchRequest;

class ApiController extends Controller
{
    //
    public function search(SearchRequest $request)
    {
        $input = $request->validated();

        return response()->json([
            'year' => $input['year'],
            'race' => $input['race'],
            'data' => 'Sample race data' // ここに実際のデータを返す
        ]);
    }
}
