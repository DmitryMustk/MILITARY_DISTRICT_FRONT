package ru.nsu.dmustakaev;

public class Consumer<T> extends Thread{
    private final Storage<T> storage;
    private final UserInterface ui;
    private final int id;

    public Consumer(Storage<T> storage, UserInterface ui, int id) {
        this.storage = storage;
        this.ui = ui;
        this.id = id;
    }

    @Override
    public void run(){
        try {
            while (true) {
                T product = storage.getProduct();
                String message = "c" + id + " consumes " + product;
                ui.showMessage(message);
                Thread.sleep((long) (50 + Math.random() * 51));
            }
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

}
