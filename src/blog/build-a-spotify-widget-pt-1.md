---
title: Building a Spotify Widget With Astro, Preact and Netlify Functions Pt. 1
slug: building-a-spotify-widget-with-astro-preact-and-netlify-functions-pt-1
pubDate: 2025-10-08
description: Scaffolding an Astro project to begin building a Spotify widget that can add personality to your portfolio site.
author: Anthony Pogliano
tags: [serverless, netlify, preact, react]
---

When I rebuilt my personal site in Astro, one of my main goals was to show a little more personality – and of course I wanted to find a little programming project that might indicate that I'm not a totally clueless developer. I love music (sooo unique) so I landed on building a Spotify widget that would make it easier to share what I've been listening to recently.

## The Stack

As I detail the setup I used to build this widget, bear in mind that a lot of parts of this are really flexible. One of the reasons that I think this writeup might be useful to others is that Astro is currently a popular choice for building out personal/portfolio sites. In this article, we will start with mock data, but later we will use Spotify's Web API to fetch real data about your listening history.

With that in mind, the things I used to build this:

- Astro, which is a static site generator that emphasizes a focus on using plain HTML and CSS for building sites. JavaScript is opt-in. Works with various frameworks.
- Spotify's Web API for providing recent data about what I am listening to
- Preact for building reactive user interface inside an Astro site
- Netlify, which is a hosting platform for front-end sites/apps, has nice tools for local development, a generous free tier, and supports serverless functions for free

## Install Astro

First thing's first: you need to [install Astro](https://docs.astro.build/en/install-and-setup/). The installation wizard will scaffold a project for you, including a basic TypeScript configuration. The documentation suggests that you can add dependencies (like Preact) from the get-go, but I have had mixed results – so I prefer to add them manually later.

In my case, I navigated to a folder where I wanted to build a project, and ran the following command:

```bash
yarn create astro ./spotify-widget-example
```

The wizard will walk you through a few options you can select. I chose the most bare-bones project structure, and I selected the option to initialize a new Git repository.

This should leave you with a project structure that looks more or less like this:

```bash
├── astro.config.mjs
├── package.json
├── public
│   └── favicon.svg
├── README.md
├── src
│   └── pages
│       └── index.astro
├── tsconfig.json
└── yarn.lock
```

Depending on which options you've selected in the Astro wizard, you may have to now run `yarn install` (or whatever package manager you're using) to install any extra dependencies.

## Install Netlify CLI

Netlify's CLI makes it possible to serve your serverless functions during development. (It also comes with a bevy of other options that faciliate development and deployment.) I have hosted other sites on Netlify, so I'm also using it because I have some familiarity with it. Netlify's documentation shows [how to install](https://docs.netlify.com/api-and-cli-guides/cli-guides/get-started-with-cli/#installation) the CLI.

You should be able to install the Netlify CLI by running the following command:

```bash
npm install -g netlify-cli
```

Afterwards, you will have to log in to your Netlify account (or create one). The link I provided above should walk you through logging in and authenticating.

> You should not have to configure or upload any sort of project on Netlify in order to use the CLI for local development. Once you've installed and authenticated, you should be able to use the `netlify dev` command to run your project locally and "serve" the function(s) in your `netlify/functions` directory.

## Project Structure

Netlify CLI expects a particular file structure when using their implementation of serverless functions. In your project's root directory add a `./netlify/functions` directory. For this demo, I'm just going to make one "endpoint" called `getTopArtists`, so I added a file to contain this function as well.

I also added a `./src/components` folder to contain the UI that will trigger requests for data from Spotify. This will be a Preact component, so make a file with a `.jsx` file extension. In my case, the UI will be responsible for making requests to the serverless function we define, and then rendering the data the serverless functions returns. Ultimately, I will be fetching a list of my favorite artists over the last six months according to Spotify, so I named it `GetTopArtists.jsx`.

Finally, I like to add a redirect so I can point my queries to something a little more ergonomic than `/.netlify/functions/<functionName>`. Netlify will let you [define redirects](https://docs.netlify.com/build/configure-builds/file-based-configuration/#redirects) in a `netlify.toml` file.

In your project's root directory, make a `netlify.toml` file and put the following inside it:

```toml title="netlify.toml"
[[redirects]]
  from="/api/*"
  to="/.netlify/functions/:splat"
  status=200
```

This creates a simple proxy, allowing us to point our queries at `/api/<functionName>`. You can skip this step if you want, you'll just send your queries to `/.netlify/functions/<functionName>` instead.

Notice that the redirect points to `/.netlify/` (with a dot), which is where the CLI compiles and serves functions, even though you write them in `/netlify/`.

After these steps, your project structure should look roughly like this:

```bash
├── astro.config.mjs
├── netlify
│   └── functions
│       └── getTopArtists.mjs
├── netlify.toml
├── package.json
├── public
│   └── favicon.svg
├── README.md
├── src
│   ├── components
│   │   └── GetTopArtists.jsx
│   └── pages
│       └── index.astro
├── tsconfig.json
└── yarn.lock
```

## Install Preact

I felt like using full-blown React was overkill for this project. React delivers a much bigger bundle to the browser than Preact does, and Preact offers familiar APIs for building reactive components. The docs detail how you can add [Preact for use in Astro](docs.astro.build/en/guides/integrations-guide/preact/). In your project directory, you should be able to run the following command to install (and configure) Preact:

```bash
yarn astro add preact
```

The installation wizard should modify your `tsconfig.json` and your `astro.config.mjs` for you – but verify just in case. If the files are unmodified, the documentation shows the steps to take to integrate Preact in your Astro project. After you run the command to install Preact, your `tsconfig.json` should look like:

```json ""jsxImportSource": "preact""
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"],
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "preact"
  }
}
```

And your `astro.config.mjs` file should look like:

```js "integrations: [preact()]"
// @ts-check
import { defineConfig } from 'astro/config'

import preact from '@astrojs/preact'

// https://astro.build/config
export default defineConfig({
  integrations: [preact()],
})
```

## Connecting the UI to Our Serverless Function

The function defined in `netlify/functions/getTopArtists.mjs` will act as an API endpoint. You will send requests to this "endpoint" and it will respond with data of some kind. As a first step in building a new feature, I always like to "wire up" my UI to the endpoint and get some sort of verification that I can send requests from and receive data in the client in return.

The [way Astro works conceptually](https://docs.astro.build/en/concepts/islands/) isn't really the main point of this post – but by default, Astro components are rendered as only HTML and CSS. In our case, we want to use JavaScript (by way of Preact) to add interactivity. We can write a JSX component and use a special, Astro-provided client directive to opt-in to using JavaScript in our application.

In your `components/GetTopArtists.jsx` file, make a simple Preact component that looks like this:

```jsx title="src/components/GetTopArtists.jsx" "'/api/getTopArtists'"
function GetTopArtists() {
  async function handleFetch() {
    try {
      const res = await fetch('/api/getTopArtists')
      const json = await res.json()

      if (json.success) {
        console.log(json.data)
      } else {
        console.log('Something weird happened')
      }
    } catch (error) {
      throw new Error('There was an error fetching your data')
    }
  }
  return (
    <>
      <button onClick={handleFetch}>Fetch Data</button>
    </>
  )
}

export default GetTopArtists
```

> Note that we are sending the request to the endpoint we defined in our `netlify.toml` file – `/api/getTopArtists`

In your `netlify/functions/getTopArtists.mjs` file, do something like this, making sure to take special care to express your own, individual skepticism towards/enthusiasm for a few different types of music:

```jsx title="./netlify/functions/getTopArtists.mjs"
export default function getTopArtists() {
  const data = {
    success: true,
    data: {
      artists: [
        'Faux-sensitive yoga-bro music',
        'Taylor Swift is just OK',
        'Bland Radio-Friendly Popstar',
      ],
    },
  }

  const successResponse = new Response(
    JSON.stringify({ success: true, data: data }),
    { status: 200 }
  )

  return successResponse
}
```

And finally, you need to render your `GetTopArtists.jsx` component in your Astro application. When you scaffolded the application using the `astro create` command, you should have been left with a file in your `./src/pages` directory called `index.astro`. In that file, you need to [import your component](https://docs.astro.build/en/basics/astro-components/) and render it.

If you've used React/Preact, Astro should embody a pretty familiar pattern: creating and composing various components. However, there are some particular Astro APIs you need to be aware of. In this case, there is a code fence (`---`) at the top of Astro files where you can do things like import other files or fetch data. In your `index.astro` file, import your `GetTopArtists.jsx` component and embed it in the markup in `index.astro` like so:

```astro title="./src/pages/index.astro" "<GetTopArtists client:load />"
---
import GetTopArtists from '../components/GetTopArtists'
---

<html lang='en'>
  <head>
    <meta charset='utf-8' />
    <link rel='icon' type='image/svg+xml' href='/favicon.svg' />
    <meta name='viewport' content='width=device-width' />
    <meta name='generator' content='{Astro.generator}' />
    <title>Spotify Widget Example</title>
  </head>
  <body>
    <h1>Astro Site</h1>
    <GetTopArtists client:load />
  </body>
</html>
```

Notice that when we embed our `<GetTopArtists />` component in the HTML found in `index.astro` we passed what kind of looks like a prop in React: `client:load`. This is what's known as a [template directive](https://docs.astro.build/en/reference/directives-reference/#clientload) in Astro. These directives give instructions to the compiler about what to do with certain components.

More specifically, `client:load` is a [client directive](https://docs.astro.build/en/reference/directives-reference/#client-directives) that tells Astro to send and hydrate a rendered component's JavaScript to the browser as soon as possible. Other directives are available to give you fine-grained control of the way you load and hydrate JavaScript in your framework components. In this instance, failing to use the `client:load` directive will cause none of the JavaScript needed to operate our component to be delivered to the browser, so our component won't work without it.

## Testing The Basic Implementation

To test out that we've wired things up correctly, we are going to run our project using the Netlify CLI. The Netlify CLI will allow us to "serve" the functions in our `netlify/functions` directory, making it possible to interact with them for testing purposes. At this point you should be able to run the command:

```bash
netlify dev
```

The Netlify CLI will attempt to automatically detect the framework we are using. In this case, it should automatically detect the Astro framework and its dev script.

This should get you a working local development server in which you can click the button rendered by your `GetTopArtists.jsx` component, and receive some data in the client that looks however you've decided to structure it. If you followed my example closely, the data returned from the `getTopArtists.mjs` serverless function should show up in the browser's console.

The command's output should tell you what port you can access your server on. In my case, the output looks like:

```bash "◈ Server now ready on http://localhost:54771"
❯ spotify-widget-example (main) ✘ netlify dev
◈ Netlify Dev ◈
◈ Injecting environment variable values for all scopes
◈ Ignored general context env var: LANG (defined in process)
◈ Setting up local development server
◈ Starting Netlify Dev with Astro
✔ Waiting for framework port 4321. This can be configured using the 'targetPort' property in the netlify.toml

   ┌──────────────────────────────────────────────────┐
   │                                                  │
   │   ◈ Server now ready on http://localhost:54771   │
   │                                                  │
   └──────────────────────────────────────────────────┘

yarn run v1.22.22
$ astro dev
warning package.json: No license field
◈ Loaded function getTopArtists
13:26:25 [types] Generated 0ms
13:26:25 [content] Syncing content
13:26:25 [content] Synced content
13:26:25 [vite] Port 4321 is in use, trying another one...
13:26:25 [vite] Port 4322 is in use, trying another one...

 astro  v5.13.2 ready in 219 ms

┃ Local    http://localhost:4323/
┃ Network  use --host to expose

13:26:25 watching for file changes...
```

The `netlify dev` command's output will show your project running on multiple ports. In my case, the address I want to use for testing my application is being served on `http://localhost:54771` – the Netlify CLI draws a big box around this address in the output for this command. Your address can and likely will look different!

The server Netlify spins up for you will handle proxying requests behind the scenes. It will serve your project as you would expect: in your browser, navigate to the address the CLI gives you and you should see your user interface/site. Issue requests to the proxy address defined in `netlify.toml` and the server will route the traffic to the serverless function(s) you've defined in your `netlify/functions` folder.

The docs for Netlify CLI show more of the [available commands](https://docs.netlify.com/api-and-cli-guides/cli-guides/get-started-with-cli/#run-a-local-development-environment) you can use to do things like run your project in different contexts (development, production, etc.), set environment variables from the command line, run your build commands, or even deploy your project directly from the command line.

## Wrapping Up

This article covered scaffolding an app using Astro and Preact to build a user interface, and Netlify's CLI to build and serve a serverless function that stands in for a more traditional rest API endpoint. At this point you should have a working, albeit minimal, Astro/Preact frontend with a "back end" that sends you some hard-coded data. The next articles will focus on authorizing our application and fetching some of our personalized data from Spotify and rendering it in our UI using the parts of the app we've already built.
