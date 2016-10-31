#Adding Controls

##Learning Objectives

* Add a textview to an activity
* Add a button to an activity
* Create listener for button click
* Change a textview's text in code

##Adding Controls

The other day we created the very simple HelloSandroid App which simply displays some text on the screen, so it's not really all that useful. Wouldn't it be cool if we could enter some text and then have some other text displayed on the page, say, what if we asked our app a question, and it gave us an answer, like a Magic 8-ball.

So, over the next couple of days we are going to build a simple Magic 8-Ball app.
 
Basically we ask it a random question, shake the ball, and get a 'random' answer in return.

##Set up project
First of all we need to set up a project for our app, so let's do that now.

```
// setup 

launchpad > android studio

Start a new android project

// application settings 

Application name: EightBall
Company Domain: com.codeclan.example

Select the sdk version version 16 (lollipop)
```

##Requirements
So what will need to implement our App? 

Basically we will need:

* some way of entering our question
* something to 'shake' to get the answer
* a way of displaying the answer


## Basic Setup

We need to follow the step we did yesterday to get the project up and running.


```
Right click on res
Select new > directory
Directory name: layout

Right click layout
New > Layout resource file
file name: activity_main
Keep LinearLayout
```

```
Right click Java > <Our Package>  > New > Java Class
Name: MainActivity
```

```
<!-- EightBall.java -->
public class MainActivity extends AppCompatActivity {

   @Override
   protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_main);
   }
}
```

```
<!-- manifest - inside application -->
<activity
           android:name="example.codeclan.com.eightball.MainActivity"
           android:label="Magic 8 Ball">
           <intent-filter>
            <action android:name="android.intent.action.MAIN"/>
            <category android:name="android.intent.category.LAUNCHER"/>
         </intent-filter>
       </activity>
```

##Adding an EditText control

The first control ([i]: or widget) that we are going to add is called an EditText control. This is a control which allows us to use the keyboard to type text onto the screen - like a textbox in HTML.

To add this control, open the res/layout/activity_main.xml file and add the following inside the LinearLayout tags

```
<!-- activity_main -->
    <EditText
        android:id="@+id/question_text"
        android:hint="@string/question"
        android:textSize="30dp"
        android:layout_marginTop="50dp"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"/>
```

Note the ```android:id``` attribute. This is how we give a control an ID so that we can access it elsewhere. 

Note that the text for the button is not being set directly. We also need to add an entry in res/values/strings.xml i.e.:

```
<!-- strings.xml -->

    <string name="question">Ask a question?</string>
```

Do you notice that there is a '+' sign in the values for ```android:id``` but not in the values for ```android:text```?  This is because you are creating the IDs and only referencing the strings (from elsewhere) [i]: purple book p. 20

The "dp" in the width and margin attributes is short for "density-independent pixel" and basically means that regardless of the screen density of a device, the size should be the same.

Now run the app in the emulator and you should see a text entry control above the TextView control created previously. You should be able to type some text (using your computer keyboard), but that's about it :-( 

###Adding a button

We need some way of submitting the text we have just entered. To help us do that we are going to add a button to our activity.

To add a button, add the following code to the activity_main.xml file, directly underneath the code you added for the EditText control:

```
<!-- activity_main.xml -->

    <Button
        android:id="@+id/shake_button"
        android:text="@string/shake"
        android:layout_marginTop="25dp"
        android:layout_marginLeft="25dp"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"/>
```

Note that the text for the button is not being set directly. We also need to add an entry in res/values/strings.xml i.e.:

```
<-- strings.xml -->

<string name="shake">Shake the ball</string>
```

Now try running your app. Hopefully, you should see a 'SHAKE THE BALL' button underneath the text entry control. Try clicking the button - what happens? NOTHING :-(

## Answer Text

Let's add a text view to hold the answer from the 8 ball.

```
<TextView
      android:id="@+id/answer_text"
      android:layout_width="wrap_content"
      android:layout_height="wrap_content"
      android:text="" />
```

For now this will just sit there empty.

###Wiring up the controls

To make the controls useful, we need to 'wire them up' to our Java code so that we can write the code that determines what happens we click the button.

Since all our controls have IDs we can access them in our MainActivity class. First of all, we need to add member variables for each of the controls.

###A Note on Naming Conventions

When we create a class variable we prefix it with "m" - this is an Android naming convention for "members" - in other words, private non-static variables.

http://source.android.com/source/code-style.html#follow-field-naming-conventions

So we would declare our class members as follows:

```
//MainActivity.java

public class MainActivity extends AppCompatActivity {

    EditText mQuestionEditText;
    TextView mAnswerText;
    Button mShakeButton;

   ...
```

If you get errors then it's probably because the required classes have not been imported. If anything appears in red then you can, as before, highlight the word and press 'alt' and 'enter' and select 'Import class'. Your imports should now include the following three lines:

```
//MainActivity.java
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
```

We now need to match the local variables we created to the controls in our activity_main.xml. We can get the reference to a control by calling the following method from the ```Activity``` class:

```
//MainActivity.java
    public View findViewById(int id)
```

This method takes a resource ID and returns a view object. In our MainActivity class, we can use the resource IDs of the controls to get the objects and assign them to the member variables we created. So lets do this in our MainActivity class.

In the ```onCreate`` method in MainActivity.java, add the following code:

```
//MainActivity.java

    mQuestionEditText = (EditText)findViewById(R.id.question_text);
    mAnswerText = (TextView)findViewById(R.id.answer_text);
    mShakeButton = (Button)findViewById(R.id.shake_button);
```

Note that in each case you need to cast the view returned by ```findViewById``` to the type of the control e.g. for mShakeButton you need to cast the view returned to ```Button```.

###Setting Listeners

So how do we get our button click to actually do something useful?

Android apps are generally event driven which means that they start and then wait for an event to happen, for example, the user pressing a button. When your app is waiting for a particular event to happen we say that it is 'listening for' that event. The object you create to respond to the event is called the 'listener', and the 'listener' implements a 'listener interface' for the event. Luckily we don't have to implement listeners for every event as the Android SDK comes already provided with listeners for various events.

[i]: think of the 'listener' events we had in JavaScript.

In our app, the event we want to listen out for is for a button being pressed (or "clicked"), so we need a listener which implements the ```View.OnClickListener``` interface.

To implement the interface we need to add the following code to the ```onCreate()``` method in our ```ActivityMain``` class, just after we assign a view to the ```mShakeButton``` member variable:

```
//MainActivity.java in onCreate

    mShakeButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                //does nothing yet but will soon!
            }
    });
```

####Anonymous Inner Classes
**************
**************
**************
**************
**************
**************
Note that the listener is implemented as an anonymous inner class. Everything enclosed in the round brackets is passed into ```setOnClickListener(OnClickListener)```. Within the round brackets you create a new nameless class and pass its whole implementation.

Since the anonmyous class implements ```OnClickListener``` it must implement that interfaces's only method, ```onClickView```.

So let's add some code to the ```onClickView``` implementation so that it outputs a message to our logging console whenever the button is clicked.

We can do this by placing the following code withing the implementation of ```onClickView``` :

```
//MainActivity.java

    Log.d("EightBall:", "Shake button clicked!");
```

Try running your app and clicking on the "Shake Button". You should see the log message in the logging console. You may need to add the "EightBall" filter similar to what we did yesterday.

###Getting the text in the text edit field

Although in our 8-ball app we're not really bothered at the moment as to what the user enters, there may/will be cases where we do want to get the text entered. So let's get the log to output what the user has entered when they click the 'Shake' button.

To get the text entered in the editText control we call the (unsurprisingly!) ```getText()``` method. i.e. to get the text for our control we could write:

```
//MainActivity.java in on click listener

    String question = mQuestionEditText.getText().toString();
```

NOTE - we need to call the ```toString()``` method because ```getText()``` does not return a string, but an object of type ```Editable```.

So we can log the text entered with something like:

```
//MainActivity.java

    Log.d("EightBall:", "The question asked was '" + question + "'");
```

So the listener should now look something like:
```
//MainActivity.java

    mShakeButton.setOnClickListener(new View.OnClickListener() {
        @Override
        public void onClick(View view) {
            String question = mQuestionEditText.getText().toString();  
            Log.d("EightBall:", "Shake button clicked!");
            Log.d("EightBall:", "The question asked was '" + question + "'");
        }
    });
```

###Changing the text field text 

Now that we have button click working we can now add code to change the text of of our text field to something. 

To set the text for the textview control we do the opposite from what we did for the EditText control, i.e. 

```
//MainActivity.java

    mAnswerText.setText("string");
```

We want to get the answer. At the moment, we'll just answer with "Computer says 'No'!"

```
    mAnswerText.setText("Computer says 'No'!");
```

Add this code to the ```onClickView``` implentation and run the app. Try adding some text and clicking submit. What happens?

##Task (10-15 mins)

At the moment, we only have one possible answer. Your task is to get the app to display a random answer from a number of possible answers. 

A possible approach may be as follows:

* create an array of strings, where each string is a possible answer
* generate a random number based on the size of the array
* use the random number generated as the index to look up the array to get the answer at that position in the array.

Possible solution: 

```
//MainActivity.java

    mShakeButton.setOnClickListener(new View.OnClickListener() {
           @Override
           public void onClick(View view) {
               String question = mQuestionEditText.getText().toString();
               Log.d("EightBall:", "Shake button clicked!");
               Log.d("EightBall:", "The question asked was '" + question +"'");
               String[] answers = {"Yes!", "No!"};
               Random rand = new Random();
               int index = rand.nextInt(answers.length);
               String answer = answers[index];
               mAnswerText.setText(answer);
           }
    });
```


