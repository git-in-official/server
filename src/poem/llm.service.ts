import { Injectable } from '@nestjs/common';
import Anthropic from '@anthropic-ai/sdk';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LlmService {
  private readonly anthropic: Anthropic;

  constructor(private readonly configService: ConfigService) {
    this.anthropic = new Anthropic({
      apiKey: this.configService.get<string>('ANTHROPIC_API_KEY'),
    });
  }

  async analyzePoem(title: string, content: string) {
    const response = await this.anthropic.messages.create({
      model: this.configService.get<string>('ANTHROPIC_MODEL')!,
      max_tokens: 200,
      temperature: 0,
      tools: [
        {
          name: 'poem_analyzer',
          description: '시의 제목과 내용을 입력하면 테마와 상호작용을 분석해',
          input_schema: {
            type: 'object',
            properties: {
              themes: {
                type: 'array',
                items: { type: 'string' },
                description:
                  '테마의 종류: 로맨틱,우정,가족,성장,희망,자연,외로움,상실,죽음,그리움,영적,성공,평화,즐거움,기쁨,갈등,화해,불확실성,추악함,좌절,불의,사랑,연민. 이 중에서 1~2개의 테마를 선택해',
              },
              interactions: {
                type: 'array',
                items: { type: 'string' },
                description:
                  '상호작용의 종류: 위로,카타르시스,감사,환희,성찰,격려,노스텔지아,자아비판,연대감,감성적,이성적,의문,상상력,축하. 이 중에서 1~2개의 상호작용을 선택해',
              },
            },
            required: ['themes', 'interactions'],
          },
        },
      ],
      tool_choice: { type: 'tool', name: 'poem_analyzer' },
      messages: [
        {
          role: 'user',
          content: `제목: ${title}\n내용: ${content}`,
        },
      ],
    });

    if (response.content[0].type === 'tool_use') {
      return response.content[0].input as {
        themes: string[];
        interactions: string[];
      };
    } else {
      console.error('Anthropic api response error');
      console.error(title, content);
      console.error(response);
      throw new Error('Anthropic api response error');
    }
  }
}
