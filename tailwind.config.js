/** @type {import('tailwindcss').Config} */
const {themes} = require("./src/app/data/themes");
module.exports = {
    content: [
        "./src/**/*.{html,js,ts}",
        "./node_modules/flowbite/**/*.js"
    ],
    theme: {
        extend: {},
    },
    plugins: [
        require('daisyui'),
        require('flowbite/plugin')
    ],
    daisyui: {
        themes: [
            {
                mytheme: {
                    "primary": "#8a7356",
                    "secondary": "#c0a788",
                    "accent": "#ffeccb",
                    "neutral": "#6a667e",
                    "base-100": "#fffdf8",
                    "info": "#008598",
                    "success": "#3ab490",
                    "warning": "#FFA500",
                    "error": "#FF6F61",
                }
            },...themes
        ]
    },
}

