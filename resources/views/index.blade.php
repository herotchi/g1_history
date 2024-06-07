<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        {{--<meta name="robots" content="noindex, nofollow">--}}
        <title>{{ config('app.name') }}</title>

        <!-- favicon -->
        <link rel="shortcut icon" href="{{ asset('favicon.ico') }}">
        <link rel="apple-touch-icon" href="{{ asset('favicon.png') }}">
        <link rel="icon" type="image/png" href="{{ asset('favicon.png') }}">

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
        <nav class="navbar bg-dark border-bottom border-body mb-3" data-bs-theme="dark">
            <div class="container-fluid">
                <span class="navbar-brand mb-0 h1">G1ヒストリー</span>
            </div>
        </nav>
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
                    <div id="playlist">
                    </div>
                </div>
            </main>
        </div>

        <div class="toast-container position-fixed top-0 end-0 p-3">
            <div id="toast" class="toast text-bg-danger" role="alert" aria-live="assertive" aria-atomic="true" data-bs-delay="3000">
                <div class="d-flex" data-bs-theme="dark">
                    <div class="toast-body">
                    </div>
                    <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="閉じる"></button>
                </div>
            </div>
        </div>

        <script src="{{ asset('js/main.js') }}"></script>
    </body>
</html>
