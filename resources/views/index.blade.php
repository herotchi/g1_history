<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        {{--<meta name="robots" content="noindex, nofollow">--}}
        <title>{{ config('app.name') }}</title>

        <!-- favicon -->
        {{--<link rel="shortcut icon" href="{{ asset('favicon.ico') }}">
        <link rel="apple-touch-icon" href="{{ asset('img/Herotchi_CMS.png') }}">
        <link rel="icon" type="image/png" href="{{ asset('img/Herotchi_CMS.png') }}">--}}

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,600&display=swap" rel="stylesheet" />

        <!-- Styles -->
        <link href="{{ asset('css/bootstrap.min.css') }}" rel="stylesheet">
        <link href="{{ asset('css/toastr.min.css') }}" rel="stylesheet">

        <!-- Scripts -->
        <script src="{{ asset('js/bootstrap.bundle.min.js') }}"></script>
        <script src="{{ asset('js/toastr.min.js') }}"></script>
    </head>
    <body>
        <div class="container">
            <main>
                <div class="row g-3">
                    <div class="col-md-6">
                        <select id="year" class="form-select{{ $errors->has('year') ? ' is-invalid' : '' }}"
                            name="year">
                            <option value="">---</option>
                        </select>
                    </div>
                    <div class="col-md-6">
                        <select id="race" class="form-select{{ $errors->has('race') ? ' is-invalid' : '' }}"
                            name="race">
                            <option value="">---</option>
                        </select>
                    </div>
                </div>
            </main>
        </div>
        <script src="{{ asset('js/main.js') }}"></script>
    </body>
</html>
