#ifndef __WASM_IMPORTS_H__
#define __WASM_IMPORTS_H__

#include <stdint.h>

extern int32_t compare(uint32_t i, uint32_t j);
extern void swap(uint32_t i, uint32_t j);
extern void print(char *string);
extern void print_number(int64_t n);

#endif
