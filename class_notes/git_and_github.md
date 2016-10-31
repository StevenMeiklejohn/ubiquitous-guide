#Git & Github

### objectives

* Understand the purpose of source code control
* Gain confidence using Git for source code control
  - Stage and commit changes
  - Inspect history and view pevious versions of code
* Integrate local repositories with remotes for off-machine backups

### duration
1 hour

## What is Git

Let's imagine we live in a sad world with no sunshine, no kittens, no sweets and certainly no source control.

If you were a dev in this sad world you might have a few things you'd like to do:

1. Back up our code
2. Keep versions of our code as "milestones" to rollback to
3. View a history of what we have done
4. Share our code with other developers (beware working on the same file!)

How would we achieve this without git?

Git allows us to solve these problems.

Git is a version control system. This means it lets us control changes to documents, or in our case, source code. "Source code" being the files that make up your computer programs.

In a nutshell, tools like Git simplify and facilitate sharing files, and changes to files, between multiple developers.

### Git alternatives

Before we go into detail with Git, it's worth noting that Git isn't the first, or only source code control choice.

Historically, source code control was centralized -- a central server would store the files for the repository. In such a system, each developer has a snapshot of the most recent version of the codebase, and would "check out" the files they wanted to edit. While they were working on them, no-one else could make any changes.

The administrators of the server have complete control over the code -- no-one can access it unless they can access the server. This has the side-effect of locking developers to the office, where there is connectivity to their servers.

### Distributed Source Code Control

Git's major difference is that every developer has a complete copy of the code base, and all its history. Although there may still be a "central" repository for all the developers to get and share updates between each other, there is no reason for the developers to be connected to any servers to do their work.

Git simplifies the merging of changes between these distributed repositories, and encourages frequent small changes to files to get rapid development.

### Some Jargon

We call the collection of code stored in git the "repository".

When we flag a file's changes to be saved to git, we say that the changes are "staged".

When we save files to git, we say they have been "commited". 

When we roll-back changes we say they have been "reverted". 

When we have to resolve differences between a file that has been worked on at the same time by multiple people we call this a "merge". 

### Git lifecycle

1. Git can be initialized on any directory - this defines our "repository"
2. Add a file and "commit" it to Git
3. Editing the file for Git to consider it modified
4. Stage the file to let Git know you want to record the changes in history
5. Commit the staged changes, and Git logs the changes in history and considers the file unmodified again

[git status lifecyle](https://lh6.googleusercontent.com/gVaIqKZb1lTccre7C7KXhMOB11RD8hcy9sJ-nrMEa419mwgKpp00z1pileUT9S_gmL6Ay65Wr2_RM8mfXVs8W0e18VtRhZoZQKjXVkRux8QtolqwIDinjii3Pg)

Similarly we might edit a file, git will see it has been modified but we can then tell git we are not happy with the changes and to roll it back.


## Typical Workflow 
* Create a wee folder
``` mkdir gitdemo ```

* Move into this folder ``` cd gitdemo ```

* Initialize an empty repository ``` git init ```

You will notice that it says "master". This is what is known as a "branch" - do not worry about this too much for now we will revist it later.  All you need to rememeber is that code commited to this "master" branch should reflect a current stable version of the code.

* Add a couple of files to the directory
 
``` touch pikachu.txt charmander.txt ```

* Stage the file (we can also type out the full file name, but the .does all files)

``` git add . ```

* See the status of the files

``` git status ```

* Commit the changes 

``` git commit -m "Initial commit" ```
``` git log ```

* Add thunderbolt to pikachu, flamethrower to charmander

``` subl .```

* Stage the changes

``` git add .```


* Commit the changes

``` git commit -m "adds basic moves" ```

* add sleep to pikachu, slam to charmander, new squirtle file.

``` git checkout . ```

* manually remove bulbasaur

Mention about git hygiene and regular, small commits with descriptive messages.


## Distributing our code

It's important to understand that with Git, we have a local copy of code (like we just made) but there is also remote copies of code that we can "pull" down or "push up" to.

There are many ways to host remote Git repositories; but one of the most common ways is to use [GitHub](http://github.com).

This is a place to store repositorites remotely, acting as a "central" copy of the source code where all participating developers can "push" their code.

This means that we an pull down a copy of open source code and contribute to it [i:] show them something cool on github.

The great thing about this is that if our laptop blows up, we can pull down a clean working version of our code at any time.


### Adding our repository to GitHub

If we want to add a remote for our repository, our first step is to log into GitHub, and [create a new, empty repository](https://github.com/new).

Name your repository, and (optionally) give it a description. *DON'T* initialize the repository with a README. If you accidentally do - no need to panic; just delete the new repository on GitHub and create one again (skipping the README this time!)

Note: You can also [do this from the command line](http://tpgmartin.com/creating-a-github-repo-from-a-cli/), without needing to go onto GitHub :-)

Copy the SSH path to your clipboard, and then use it to add a new remote to your Git repository:

```
  git remote add origin git@github.com:USERNAME/REPOSITORYNAME.git
```
Note that "origin" is just a name - we could call it anything. Origin is just a convention.

When you want to send your local code to GitHub, push it with `git push origin master`. This will push all the committed code in the local master branch (we'll cover branches later) to the remote called '[origin](http://stackoverflow.com/questions/9529497/what-is-origin-in-git)'


## Updating remote repositories

When we make changes to files, these alterations are not automatically saved. We need to "push" our changes to out remote branch when we are ready.

Lets add another move to Pikachu.

``` subl . ```

```
  git push origin master
  
```

There may be time we commit locally, but not to the remote straight away. This means we can roll-back to a point in our local history if we are not happy with our changes. We will talk about this more in depth in another lesson.

Similarly we can pull down other people's changes with the "pull command"

``` git pull origin master ```

### Creating a local copy of an existing GitHub repository

If you want to make a local copy of a repository that is already on GitHub, you will use the "clone" command.

Open the repository you want to clone in GitHub, and copy the SSH path to your clipboard, and then use it to clone the remote to a new directory on your computer (ensure to not be in a directory already tracked by Git):

```
  git clone git@github.com:USERNAME/REPOSITORYNAME.git
```


## Further investigation

We'll leave you to investigate other Git resources, cheat-sheets, and tutorials. Please find out what the ".gitignore" file does.

GitHub does give you a GUI interface you can install, but we're going to work with the command-line interface for the most part, because we may not always have a GUI available to us.

http://git-scm.com/docs/
[Github](http://byte.kde.org/~zrusin/git/git-cheat-sheet-medium.png) 
http://ftp.newartisans.com/pub/git.from.bottom.up.pdf
http://rogerdudler.github.io/git-guide/
