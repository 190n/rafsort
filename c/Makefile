CC=clang
CFLAGS=-Wall -Wextra -Werror -Wpedantic --target=wasm32 -O3 -flto -nostdlib -Iinclude
LDFLAGS=--no-entry --export-all --lto-O3 --allow-undefined-file=wasm.syms
LD=wasm-ld
OBJS=bubble.o queue.o quick.o shell.o stack.o malloc.o

all: install

sorts.wasm: $(OBJS)
	$(LD) $(LDFLAGS) -o sorts.wasm $(OBJS)

%.o: %.c
	$(CC) $(CFLAGS) -c $< -o $@

clean:
	rm -f sorts.wasm $(OBJS)

install: sorts.wasm
	cp sorts.wasm ../public/
