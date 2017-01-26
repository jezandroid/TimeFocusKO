cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/cordova-plugin-insomnia/www/Insomnia.js",
        "id": "cordova-plugin-insomnia.Insomnia",
        "pluginId": "cordova-plugin-insomnia",
        "clobbers": [
            "window.plugins.insomnia"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-insomnia": "4.2.0"
}
// BOTTOM OF METADATA
});