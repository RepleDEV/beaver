cl /EHsc .\test\test_binding.cpp .\src\sndway_api.cc /I .\hidapi-win\include\ /link /LIBPATH:".\hidapi-win\x64\" hidapi.lib /out:dist/out.exe
echo "Copying DLL"
cp .\hidapi-win\x64\hidapi.dll .\build\Release\hidapi.dll
echo "Done"
