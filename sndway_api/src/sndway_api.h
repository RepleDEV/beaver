#include <cstdint>

#ifdef _WIN64
#include <hidapi.h>
#else
#include <hidapi/hidapi.h>
#endif

#define DATA_BUFFER_SIZE 64

class SndwayAPI {
    public:
        int m_res;
        unsigned short m_VID;
        unsigned short m_PID;
        hid_device *m_handle;
        unsigned char m_buf[DATA_BUFFER_SIZE];
        bool m_connected;

        SndwayAPI();
        int open();
        uint16_t read();
        void close();
};
