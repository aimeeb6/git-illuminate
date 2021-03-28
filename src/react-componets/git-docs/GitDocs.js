import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

function GitIntro() {
  return (
    <div style={{ paddingBottom: 50, height: '600px' }}>
      <Typography variant="h1"> What is Git?</Typography>
      <hr />
      <br />
      <br />
      <Card variant="outlined">
        <CardContent>
          <Typography variant="body2" component="p">
            Git is an <strong>distributed version control system</strong>. As a
            version control system it tracks all changes made in the folder it's
            active in. As a distrubted system it allows many users to collabrate
            the same files.
          </Typography>
        </CardContent>
      </Card>
      <br />
      <br />
      <Typography variant="h4" color="secondary">
        Why a use version control?
      </Typography>
      <br />
      <Typography variant="body1">
        Real life projects generally have multiple developers working in
        parallel. So a version control system like Git is needed to ensure there
        are no code conflicts between the developers.
      </Typography>

      <br />
      <Typography variant="h5" color="secondary">
        {' '}
        Benefits of Git{' '}
      </Typography>
      <ul>
        <li>Allows the user to revert to previous code</li>
        <li>Allows multiple users.</li>
        <li>
          With branches, allows many features to be developed simultaneously{' '}
        </li>
      </ul>
      <br />
      <br />
      <br />
      <br />
    </div>
  );
}

function ConfigureGit() {
  return (
    <div id="config-git-doc" style={{ height: '100vh', overflow: 'auto' }}>
      <Typography variant="h1"> Configure Git </Typography>
      <hr />
      <br />
      <Typography variant="h4" color="secondary">
        Install Git
      </Typography>
      <br />
      <Typography variant="body1">
        To check if git is installed. Enter{' '}
        <code
          style={{
            backgroundColor: '#dce0e0',
            color: 'black',
            paddingTop: 3,
            paddingBottom: 3,
          }}
        >
          $git --version
        </code>
        &nbsp; into your command line interface. If it returns a number higher
        than&nbsp;
        <code
          style={{
            backgroundColor: '#dce0e0',
            color: 'black',
            paddingTop: 3,
            paddingBottom: 3,
          }}
        >
          1.7.10{' '}
        </code>
        , you're set!. Else visit the git website - http://git-scm.com/
      </Typography>
      <br />
      <Typography variant="h4" color="secondary">
        Configure Git
      </Typography>
      <Typography variant="body1">
        Once git is installed on your machine you can configure it with your
        personal details.
      </Typography>
      <br />
      <Typography variant="body1">Set your details</Typography>
      <code
        style={{
          backgroundColor: '#dce0e0',
          color: 'black',
          paddingTop: 3,
          paddingBottom: 3,
        }}
      >
        git config --global user.name "Your name"{' '}
      </code>
      <br />
      <br />
      <Typography variant="body1">Set your details</Typography>
      <code
        style={{
          backgroundColor: '#dce0e0',
          color: 'black',
          paddingTop: 3,
          paddingBottom: 3,
        }}
      >
        git config --global user.email "youremail@email.com"{' '}
      </code>
    </div>
  );
}
export { GitIntro, ConfigureGit };
