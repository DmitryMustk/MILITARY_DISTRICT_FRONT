package ru.nsu.dmustakaev;

import java.util.ArrayList;
import java.util.InputMismatchException;
import java.util.List;
import java.util.Scanner;

public class UserInterface {
    final private Scanner scanner;

    public UserInterface(Scanner scanner) {
        this.scanner = scanner;
    }

    public List<Integer> getParams() {
        System.out.println("Type N, P, C: ");
        var params = new ArrayList<Integer>();
        try {
            for (int i = 0; i < 3; ++i) {
                params.add(scanner.nextInt());
            }
        }
        catch(InputMismatchException e) {
            System.out.println("Wrong input.");
            return null;
        }
        return params;
    }

    public void showMessage(String message) {
        System.out.println(message);
    }

}
