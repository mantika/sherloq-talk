const url = process.env.SHERLOQ_API_URL || 'https://api.sherloq.io';
const token = process.env.SHERLOQ_TOKEN;
const autoAction = process.env.SHERLOQ_AUTO_ACTION || false;
const fetch = require('node-fetch');
const CommentsService = require('services/comments.js')

module.exports = {
  hooks: {
    RootMutation: {
      createComment: {
        post: async (obj, args, context, info, result) => {
          let body = {
            "data": {
              "text": args.body
            },
            "criteria": ["hate_speech"],
            "labels": {
              "comment_id": result.comment.id,
              "asset_id": result.asset_id
            }
          };

          let headers = {
            "content-type": "application/json",
            "authorization": "Basic " + new Buffer(token + ":").toString("base64")
          }

          await fetch(url + '/moderations', {method: 'POST', body: JSON.stringify(body), headers: headers})
          .then(res => res.json())
          .then(json => {
            if (autoAction) {
              if (json.scores.hate_speech[0].score < 90) {
                return CommentsService.setStatus(result.comment.id, 'ACCEPTED')
                .then(() => result.comment.status = 'ACCEPTED')
              }
            }
          })
          .catch(function(err) {
            console.log(err);
          });
          return result;
        }
      }
    }
  }
};
