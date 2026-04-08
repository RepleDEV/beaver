#pragma once

#include <napi.h>

#include "sndway_api.h"

class Wrapper : public Napi::ObjectWrap<Wrapper> {
    public:
        Wrapper(const Napi::CallbackInfo&);
        static Napi::Function GetClass(Napi::Env);

        Napi::Value Open(const Napi::CallbackInfo&);
        Napi::Value Read(const Napi::CallbackInfo&);
        void Close(const Napi::CallbackInfo&);

        Napi::Value IsConnected(const Napi::CallbackInfo&);
    private:
        SndwayAPI m_api;
};
