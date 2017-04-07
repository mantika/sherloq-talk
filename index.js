const url = process.env.SHERLOQ_API_URL || 'https://api.sherloq.io';
const token = process.env.SHERLOQ_TOKEN;
const fs = require('fs');
const fetch = require('node-fetch');
const CommentsService = require('services/comments.js')
const config = JSON.parse(process.env.SHERLOQ_CONFIG || {});
const sherloqDebug = require('debug')('talk:sherloq');


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
              "asset_id": result.comment.author_id,
              "author_id": result.comment.asset_id
            }
          };

          let headers = {
            "content-type": "application/json",
            "authorization": "Basic " + new Buffer(token + ":").toString("base64")
          }
          console.log(body);

          await fetch(url + '/moderations', {method: 'POST', body: JSON.stringify(body), headers: headers})
          .then(res => res.json())
          .then(json => {
            if (!config.noAction) {
              // if pre-mod
              if (result.comment.status == 'PREMOD') {
                // use reject score if specified or accept healthy moderations automatically
                if ((config.reject && json.scores.hate_speech[0].score < config.reject.score)
                    || json.scores.hate_speech[0].extra.label == 'healthy') {

                  sherloqDebug('Accepting comment')
                  return CommentsService.setStatus(result.comment.id, 'ACCEPTED')
                  .then(() => result.comment.status = 'ACCEPTED')

                }
              } else {
                if ((config.reject && json.scores.hate_speech[0].score >= config.reject)
                     || json.scores.hate_speech[0].extra.label == 'offensive') {

                  sherloqDebug('Rejecting comment')
                  return CommentsService.setStatus(result.comment.id, 'REJECTED')
                  .then(() => result.comment.status = 'REJECTED')

                } else if ((config.flag && json.scores.hate_speech[0].score >= config.flag)
                           || json.scores.hate_speech[0].extra.label == 'suspicious') {

                  sherloqDebug('Flagging comment')
                  return CommentsService.addAction(result.comment.id, result.comment.author_id, 'FLAG')
                  .then();
                }
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
