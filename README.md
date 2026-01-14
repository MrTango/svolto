# svolto - THIS IS AN EXPERIMENT FOR NOW!!!

Svelte rendering of Volto Blocks content from hybrid CMS Plone
You will need a Plone Backend with plone.restapi enabled.
The content is managed by using the default Plone Frontedn `Volto`.


## Developing

### Start background and Volto containers

```bash
docker compose up -d

[+] Running 4/4
 ✔ Network appsuite             Created                                                                                                                                                                                                                  0.1s
 ✔ Container svolto-db-1        Healthy                                                                                                                                                                                                                  0.1s
 ✔ Container svolto-backend-1   Started                                                                                                                                                                                                                  0.1s
 ✔ Container svolto-frontend-1  Started
```

### Run SvelteKit dev server

```bash
pnpm i
```


```bash
pnpm run dev

# or start the server and open the app in a new browser tab
pnpm run dev -- --open
```

## Building

To create a production version of your app:

```bash
pnpm run build
```

You can preview the production build with `pnpm run preview`.

