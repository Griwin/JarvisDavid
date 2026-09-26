<?php

declare(strict_types=1);

namespace App\DTO;

use Symfony\Component\Validator\Constraints as Assert;

final readonly class SummarizeRequest
{
    public function __construct(
        #[Assert\NotBlank]
        #[Assert\Length(min: 50, max: 20000)]
        public string $text,
    ) {
    }
}
