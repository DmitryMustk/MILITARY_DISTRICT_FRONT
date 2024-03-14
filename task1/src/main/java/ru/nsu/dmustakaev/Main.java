package ru.nsu.dmustakaev;

import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        UserInterface ui = new UserInterface(scanner);
        var params = ui.getParams();
        if(params == null)
            return;

        int N = params.getFirst();
        int P = params.get(1);
        int C = params.get(2);

        Storage<String> storage = new Storage<>(N);

        for(int i = 0; i < P; ++i) {
            Producer<String> producer = new Producer<>(storage, i);
            producer.start();
        }

        for(int i = 0; i < C; ++i) {
            Consumer<String> consumer = new Consumer<>(storage, ui, i);
            consumer.start();
        }
    }
}