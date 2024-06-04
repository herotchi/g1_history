<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\Api\SearchRequest;
use Google_Client;
use Google_Service_YouTube;

class ApiController extends Controller
{
    //
    public function search(SearchRequest $request)
    {
        $input = $request->validated();

        $client = new Google_Client();
        $client->setApplicationName('G1-History');
        $client->setDeveloperKey(config('app.api_key'));

        $youtube = new Google_Service_YouTube($client);
        $params = [
            'q'             => "{$input['year']} {$input['race']}",
            'type'          => 'video',
            'maxResults'    => 2,
        ];

        try {
            $videos = $youtube->search->listSearch('id', $params);    
        } catch (Google_Service_Exception $e) {
            $response['errors']  = $e->getMessage();
            throw new HttpResponseException(response()->json($response));
        } catch (Google_Exception $e) {
            $response['errors']  = $e->getMessage();
            throw new HttpResponseException(response()->json($response));
        }

        $idList = [];
        foreach ($videos['items'] as $video) {
            $idList[] = $video['id']['videoId'];
        }

        return response()->json(['idList' => $idList]);
    }
}
