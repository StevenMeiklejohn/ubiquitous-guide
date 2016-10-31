package com.codeclan.example.eightball;

import dalvik.annotation.TestTargetClass;
import org.junit.Test;
import static org.junit.Assert.*;

/**
 * Created by user on 03/08/2016.
 */
public class AnswersFromSimpleStringsTest {

    @Test
    public void getAnswersTest() {
        Answers answers = new AnswersFromSimpleStrings();
        assertNotNull(answers.getAnswers());
    }

    @Test
    public void getLength() {
        Answers answers = new AnswersFromSimpleStrings();
        assertNotNull(answers.getLength());
    }

    @Test
    public void getAnswerAtIndex() {
        AnswersFromSimpleStrings answers = new AnswersFromSimpleStrings();
        answers.add("Yes");
        answers.add("That would be an ecumenical matter!");
        assertEquals("That would be an ecumenical matter!", answers.getAnswerAtIndex(1));

    }

    @Test
    public void addTest() {
        AnswersFromSimpleStrings answers = new AnswersFromSimpleStrings();
        int originalNumberOfAnswers = answers.getLength();
        answers.add("Yes");

        assertEquals(originalNumberOfAnswers + 1, answers.getLength());
    }

    @Test
    public void getAnswerTest() {
        AnswersFromSimpleStrings answers = new AnswersFromSimpleStrings();
        answers.add("Yes");
        answers.add("That would be an ecumenical matter!");

        String answer = answers.getAnswer();
        System.out.println("The answer is..." + answer);
        assertNotNull(answer);
    }
}
