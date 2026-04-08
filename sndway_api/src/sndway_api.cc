#include <hidapi/hidapi.h>

#include "sndway_api.h"

#define VID 0x0483
#define PID 0x5750

SndwayAPI::SndwayAPI() {
    this->m_VID = VID;
    this->m_PID = PID;

    this->m_res = hid_init();
}
int SndwayAPI::open() {
    this->m_handle = hid_open(VID, PID, NULL);
    if (!this->m_handle)
        return 1;

    this->m_connected = true;

    return 0;
}

uint16_t SndwayAPI::read() {
    if (!this->m_connected || !this->m_handle)
        return 0;

    // Request data
    this->m_buf[0] = 0xb3;
    this->m_res = hid_write(this->m_handle, this->m_buf, 64);

    if (this->m_res == -1) {
        this->m_connected = false;
        return 0;
    }

    // Read
    this->m_res = hid_read(this->m_handle, this->m_buf, 64);
    
    // Binary combine 2x 8 bits of unsigned char to 16 bit uint
    uint16_t level = (this->m_buf[0] << 8) | this->m_buf[1];
    return level;
}
void SndwayAPI::close() {
    hid_close(this->m_handle);
    this->m_handle = nullptr;
    this->m_connected = false;
    this->m_res = hid_exit();
}
