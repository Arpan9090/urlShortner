package com.arpan.url_shortner.util;
import java.security.SecureRandom;

public class Base62 {

    private static final String BASE62_ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    private static final SecureRandom RANDOM = new SecureRandom();

    public static String generateRandomCode(int length) {
        StringBuilder sb = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            int randomIndex = RANDOM.nextInt(BASE62_ALPHABET.length());
            sb.append(BASE62_ALPHABET.charAt(randomIndex));
        }
        return sb.toString();
    }
}
