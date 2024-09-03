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
    try {
      const response = await this.anthropic.messages.create({
        model: this.configService.get<string>('ANTHROPIC_MODEL')!,
        max_tokens: 200,
        temperature: 0,
        system:
          '시의 분위기를 결정하는 테마태그는 [로맨틱,우정,가족,성장,희망,자연,외로움,상실,죽음,그리움,영적,성공,평화,즐거움,기쁨,갈등,화해,불확실성,추악함,좌절,불의,사랑,연민] 이 있다. 작가의 의도나 시의 메세지를 의미하는 상호작용 태그는 [위로,카타르시스,감사,환희,성찰,격려,노스텔지아,자아비판,연대감,감성적,이성적,의문,상상력,축하] 이 있다. 입력받은 시의 제목과 내용을 기반으로 {themes: [], interactions: []} 형태로 반환하는데 themes엔 테마태그중에서 0~2개, interactions엔 상호작용 태그중에서 0~2개를 선택하지만 마땅히 고를 태그가 없을 경우엔 빈 배열로 반환한다. 선택의 이유는 절대 설명하지 않고 그저 json형태로만 반환한다.',
        messages: [
          {
            role: 'user',
            content: `제목: ${title}\n내용: ${content}`,
          },
        ],
      });

      if (response.content[0].type === 'text') {
        return JSON.parse(response.content[0].text) as {
          themes: string[];
          interactions: string[];
        };
      }
      throw response;
    } catch (error) {
      console.error('Anthropic api error');
      console.error(title, content);
      console.error(error);
      console.error(typeof error);
      throw new Error('Anthropic api error');
    }
  }

  async updateTag(updateTagInput: UpdateTagInput) {
    try {
      const result = await this.anthropic.messages.create({
        model: this.configService.get<string>('ANTHROPIC_MODEL')!,
        max_tokens: 1024,
        temperature: 0.5,
        system:
          '시의 제목, 내용, 원래 가지고 있는 시의 분위기를 결정하는 테마태그와 작가의 의도나 시의 메시지를 의미하는 상호작용 태그, 그리고 새로운 테마태그와 상호작용 태그를 입력하면 새로운 테마태그와 상호작용 태그에 맞춰서 시의 제목과 내용을 수정하되, 태그에 나오는 단어는 절대 사용하지 않는다. 그리고 시의 제목은 꼭 수정할 필요는 없다. 반환값은 {title: string, content: string} 형태로 주면 되고 수정한 이유는 절대 설명하지 말고 그저 json 형태로만 반환한다',
        messages: [
          {
            role: 'user',
            content: JSON.stringify(updateTagInput),
          },
        ],
      });

      if (result.content[0].type === 'text') {
        return JSON.parse(result.content[0].text) as {
          title: string;
          content: string;
        };
      }
      throw result;
    } catch (error) {
      console.error('Anthropic api error');
      console.error(updateTagInput);
      console.error(error);
      console.error(typeof error);
      throw new Error('Anthropic api error');
    }
  }
}

export type UpdateTagInput = {
  title: string;
  content: string;
  beforeThemes: string[];
  beforeInteractions: string[];
  afterThemes: string[];
  afterInteractions: string[];
};
