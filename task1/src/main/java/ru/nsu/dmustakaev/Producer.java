package ru.nsu.dmustakaev;

public class Producer<T> extends Thread {
    private final Storage<T> storage;
    private final int id;

    Producer(Storage<T> storage, int id) {
        this.storage = storage;
        this.id = id;
    }

    @Override
    public void run(){
        try {
            for(int i = 0;;++i) {
                String product = "p" + id + "-" + i;
                storage.putProduct((T) product);
                Thread.sleep(1000);
            }
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
}
