{
  'targets': [
    {
      'target_name': 'sndway_api-native',
      'sources': [
        'src/napi_wrapper.cc',
        'src/sndway_api.cc',
      ],
      'include_dirs': [
        "<!@(node -p \"require('node-addon-api').include\")",
      ],
      'dependencies': ["<!(node -p \"require('node-addon-api').gyp\")"],
      'cflags!': [ '-fno-exceptions' ],
      'cflags_cc!': [ '-fno-exceptions' ],
      'xcode_settings': {
        'GCC_ENABLE_CPP_EXCEPTIONS': 'YES',
        'CLANG_CXX_LIBRARY': 'libc++',
        'MACOSX_DEPLOYMENT_TARGET': '10.7'
      },
      'msvs_settings': {
        'VCCLCompilerTool': { 'ExceptionHandling': 1 },
      },
      'conditions': [ 
        ['OS=="linux"', {
          'ldflags': [
            '-lhidapi-hidraw'
          ],
        }],
        ['OS=="win"', {
          'include_dirs': {
              '<!(echo %cd%)/hidapi-win/include/'
          },
          'link_settings': {
            'libraries': [
              '<!(echo %cd%)/hidapi-win/x64/hidapi.lib'
            ],
          },
        }],
      ]
    }
  ]
}
