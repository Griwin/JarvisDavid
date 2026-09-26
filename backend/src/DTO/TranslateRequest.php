<?php

declare(strict_types=1);

namespace App\DTO;

use Symfony\Component\Validator\Constraints as Assert;

final readonly class TranslateRequest
{
    public function __construct(
        #[Assert\NotBlank]
        #[Assert\Length(max: 5000)]
        public string $text,
        #[Assert\Choice(choices: ['fr', 'en', 'zh'])]
        public string $sourceLanguage,
        #[Assert\Choice(choices: ['fr', 'en', 'zh'])]
        public string $targetLanguage,
        #[Assert\Choice(choices: ['natural', 'friendly', 'polite'])]
        public string $tone = 'natural',
    ) {
    }
}
