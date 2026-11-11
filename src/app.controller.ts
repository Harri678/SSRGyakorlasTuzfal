import { Body, Controller, Get, Post, Render } from '@nestjs/common';
import { AppService } from './app.service.js';
import type { szabalyDto } from './szbalyDto.dto.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/')
  @Render('index')
  async getRules(){
    return{
      errors: [],
      szabalyok: (await this.appService.szabalyokListazasa())
      .toSorted((a, b) => a.priority - b.priority)
    }
  }

  @Post('/')
  @Render('index')
  async szabalyHozzaadasa(@Body() body: szabalyDto){

    var errors: string[] = [] 

    const macRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/
    if(!macRegex.test(body.mac)){
      errors.push("Rossz mac adresst adtal meg")
    }

    if(errors.length > 0){
      return{
        errors: errors,
        szabalyok: (await this.appService.szabalyokListazasa())
        .toSorted((a, b) => a.priority - b.priority)
      }
    }else{

      this.appService.szabalyHozzaadasa(body)
  
      return{
        errors: [],
        szabalyok: (await this.appService.szabalyokListazasa())
        .toSorted((a, b) => a.priority - b.priority)
      }
    }
  }


}
