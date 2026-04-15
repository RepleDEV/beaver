#include <iostream>
#include <cstdint>
#include "../src/sndway_api.h"

// TODO: Add gtest testing library
int main() {
    SndwayAPI api = SndwayAPI();
    std::cout << "Opening device..." << std::endl;
    int res = api.open();
    std::cout << "Open result: " << res << std::endl;

    std::string continueInput;

    std::cout << "Continue? (Y/N): ";
    std::cin >> continueInput;

    if (continueInput != "Y") {
        return 0;
    }

    std::cout << "Reading device..." << std::endl;
    uint16_t reading = api.read();
    std::cout << "Device reading: " << reading;

    return 0;
}
