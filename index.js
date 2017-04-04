const url = process.env.SHERLOQ_API_URL || 'https://api.sherloq.io';
const token = process.env.SHERLOQ_TOKEN;
const auth = require('basic-auth');
const fetch = require('node-fetch');

module.exports = {
  hooks: {
    RootMutation: {
      createComment: {
        post: async (obj, args) => {
          let body = {
            "data": {
              "text": args.body
            },
            "criteria": ["hate_speech"],
            "labels": {
              "comment_id": args.asset_id
            }
          };

          let headers = {
            "content-type": "application/json",
            "authorization": "Basic " + new Buffer(token + ":").toString("base64")
          }

          return fetch(url + '/moderations', {method: 'POST', body: JSON.stringify(body), headers: headers})
          .catch(function(err){
            console.log(err);
          });
        }
      }
    }
  }
};
