package ru.nsu.dmustakaev;

import java.util.Stack;

public class Storage<T> {
    private final int maxCapacity;
    private final Stack<T> store;

    public Storage(int maxCapacity) {
        this.maxCapacity = maxCapacity;
        store = new Stack<>();
    }

    public synchronized void putProduct(T product) throws InterruptedException {
        synchronized (this) {
            while (store.size() == maxCapacity) {
                wait();
            }
            store.add(product);
            notifyAll();
        }

    }

    public synchronized T getProduct() throws InterruptedException {
        synchronized (this) {
            while (store.isEmpty()) {
                wait();
            }
            T product = store.pop();
            notifyAll();
            return product;
        }

    }
}
