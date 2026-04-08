#include <cstdint>
#include <chrono>

#include "napi.h"

#include "napi_wrapper.h"

using namespace Napi;

Wrapper::Wrapper(const Napi::CallbackInfo& info) : ObjectWrap(info) {
    // Napi::Env env = info.Env();
    
    this->m_api = SndwayAPI();
}

Napi::Value Wrapper::Open(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    int res = this->m_api.open();

    return Napi::Number::New(env, res);
}

Napi::Value Wrapper::Read(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    uint16_t res = this->m_api.read();

    const auto now = std::chrono::system_clock::now();
    const auto epoch = now.time_since_epoch();

    const auto ms = std::chrono::duration_cast<std::chrono::milliseconds>(epoch);

    Object obj = Object::New(env);

    obj.Set("reading", res);
    obj.Set("timestamp", ms.count());
    
    return obj;
}

void Wrapper::Close(const Napi::CallbackInfo& info) {
    this->m_api.close();

    return;
}

Napi::Value Wrapper::IsConnected(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();

    return Napi::Boolean::New(env, this->m_api.m_connected);
}

Napi::Function Wrapper::GetClass(Napi::Env env) {
    return DefineClass(env, "SndwayApi", {
        // Adds a method to the class
        Wrapper::InstanceMethod("open", &Wrapper::Open),
        Wrapper::InstanceMethod("read", &Wrapper::Read),
        Wrapper::InstanceMethod("close", &Wrapper::Close),
        Wrapper::InstanceMethod("is_connected", &Wrapper::IsConnected),
    });
}

// Don't touch this
Napi::Object Init(Napi::Env env, Napi::Object exports) {
    Napi::String name = Napi::String::New(env, "SndwayApi");
    exports.Set(name, Wrapper::GetClass(env));
    return exports;
}

NODE_API_MODULE(addon, Init)
