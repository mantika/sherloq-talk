# Sherloq Talk plugin

The following plugin sends Talk (https://coralproject.net/products/talk.html) comments to Sherloq for moderation

Here's a video about how the integration looks: 

[![Alt text](https://img.youtube.com/vi/e5S0-WTCA8c/0.jpg)](https://youtu.be/e5S0-WTCA8c)


## Getting started

1. Install the `sherloq-talk` plugin from NPM by following [Talk plugin instructions](https://github.com/coralproject/talk/blob/master/PLUGINS.md)

2. Create an account in Sherloq (https://admin.sherloq.io/signup)

3. Once logged in, create a token by going the `Tokens` menu

Set the env variable `SHERLOQ_TOKEN` with the token created in the previous step.

## Advanced Configuration

Set the following env variables in your talk setup: 

- `SHERLOQ_TOKEN` (required) - Sherloq account API token
- `SHERLOQ_API_URL` (optional for dev setup) - Sherloq API endpoint 
- `SHERLOQ_CONFIG` (optional) - string based json settings:

---

- `noAction` - Set `true` if no action should be taken (default `false`)
- `flag`
   - `score` - Flag comment in dep-mod streams if SherloQ score is greater of equal to this value
- `reject`
   - `score` - Accept or reject comments depending on this score value
