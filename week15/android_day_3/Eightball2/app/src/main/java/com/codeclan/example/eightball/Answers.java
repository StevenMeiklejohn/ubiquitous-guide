package com.codeclan.example.eightball;

import java.util.ArrayList;
import java.util.Random;

/**
 * Created by user on 03/08/2016.
 */
public abstract class Answers implements Answerable {
    protected ArrayList<String> mAnswers;

    public Answers() {
        mAnswers = new ArrayList<String>();
        setupAnswers();
    }

    public Answers(ArrayList<String> answers) {
        mAnswers = answers;
    }

    public ArrayList<String> getAnswers() {
        return new ArrayList<String>(mAnswers);
    }

    public void add(String answer) {
        mAnswers.add(answer);
    }

    public String getAnswerAtIndex(int index) {
        return mAnswers.get(index);
    }

    public int getLength() {
        return mAnswers.size();
    }

    public String getAnswer() {
        Random r = new Random();
        int listSize = getLength();
        int index = r.nextInt(listSize);
        String answer = getAnswerAtIndex(index);
        return answer;
    }

    abstract public void setupAnswers();

}

