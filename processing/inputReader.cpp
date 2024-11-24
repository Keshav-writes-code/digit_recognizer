#include<iostream>
#include<fstream>

int main(){
    std::ifstream file("../input/train-images.idx3-ubyte", std::ios::binary);
    char character = 'h';
    while (file.read(&character, 1)){
        std::cout<<character;
    }
}