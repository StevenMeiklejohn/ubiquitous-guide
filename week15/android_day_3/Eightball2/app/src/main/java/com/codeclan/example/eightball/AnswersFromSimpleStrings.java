package com.codeclan.example.eightball;

import java.util.ArrayList;

/**
 * Created by user on 03/08/2016.
 */
public class AnswersFromSimpleStrings extends Answers {

    public AnswersFromSimpleStrings() {
        super();
    }

    public AnswersFromSimpleStrings(ArrayList<String> answers) {
        mAnswers = answers;
    }

    @Override
    public void setupAnswers() {
        String[] answers = {
                "Yes!",
                "That would be an ecumenical matter!"
        };
        for(String answer : answers) {
            add(answer);
        }
    }
}
