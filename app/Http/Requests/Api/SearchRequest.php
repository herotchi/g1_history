<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

use Illuminate\Validation\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Contracts\Validation\Validator as failedValidator;
use Illuminate\Http\Exceptions\HttpResponseException;

class SearchRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $jsonPath = public_path('json/year.json');
        if (!file_exists($jsonPath)) {
            return response()->json(['error' => 'File not found'], 404);
        }

        $json = file_get_contents($jsonPath);
        $data = json_decode($json, true);
        $years = array_column($data, 'year');

        return [
            //
            'year' => ['bail', 'required', 'integer', 'numeric', Rule::in($years)],
            'race' => ['bail', 'required', 'string'],
        ];
    }


    public function after(): array
    {
        return [
            function (Validator $validator) {
                $input = $validator->valid();

                if ($validator->errors()->has('year') === false) {
        
                    $races = [];
                    $jsonPath = public_path('json/race.json');
                    if (!file_exists($jsonPath)) {
                        return response()->json(['error' => 'File not found'], 404);
                    }

                    $json = file_get_contents($jsonPath);
                    $data = array_filter(json_decode($json, true), function($tmp) {
                        return $tmp['year'] === 2020;
                    });

                    foreach ($data[0]['races'] as $race) {
                        $races[] = $race['name'];
                    }

                    if (!in_array($input['race'], $races)) {
                        $validator->errors()->add('race', '選択した年代ではそのレースは存在しません。');
                    }
                }
            }
        ];
    }


    protected function failedValidation(failedValidator $validator)
    {
        $response['errors']  = $validator->errors()->toArray();
    
        throw new HttpResponseException(response()->json($response));    
    }
}
