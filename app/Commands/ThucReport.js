'use strict'

const { Command } = require('@adonisjs/ace')
const Database = use('Database')
const Config = use('Config')

class ThucReport extends Command {
  static get signature() {
    return 'thuc:report'
  }

  static get description() {
    return 'Tell something helpful about this command'
  }

  async handle(args, options) {
    let stream = await Database.connection('mysql').select("*").from('edu_users').stream();
    const codes = Config.get('order')
    let result = ""
    stream.on('data', (chunk) => {
      let check = true
      let codeList = chunk.code ? chunk.code.split(',') : []
      let timeActiveCode = chunk.time_active_code ? chunk.time_active_code.split(',') :[]
      let keyCodeCheck = false;
      let record;
      let time1, time2;
      for(let i in codeList) {
        let keyCode = codeList[i]
        if(codes[keyCode]) {
          time1 = timeActiveCode[i]
          keyCodeCheck = true;
          break;
        }
      }

      let keyCodeSmartCheck;
      let codeSmartList = chunk.code_smart ? chunk.code_smart.split(',') : []
      let timeActiveCodeSmart = chunk.time_active_code_smart ? chunk.time_active_code_smart.split(',') :[]
      for(let i in codeSmartList) {
        let keyCode = codeSmartList[i]
        if(codes[keyCode]) {
          time2 = timeActiveCodeSmart[i]
          keyCodeSmartCheck = true;
          break;
        }
      }

      if(keyCodeCheck || keyCodeSmartCheck) {
        result = `${chunk.id},"${chunk.username}", "${chunk.code}", ${chunk.code_smart},"${time1}", "${time2}"`
      }
      const fs = require('fs');

      fs.appendFile('result.csv', 'data to append', function (err) {
        if (err) throw err;
        console.log('Saved!');
      });
    })
  }
}

module.exports = ThucReport
