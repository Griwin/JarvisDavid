<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiProperty;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use App\Repository\AiRequestRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use App\Enum\AiRequestType;

#[ORM\Entity(repositoryClass: AiRequestRepository::class)]
#[ApiResource(
    operations: [
        new Post(),
        new GetCollection(),
    ]
)]
class AiRequest
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(type: 'text')]
    #[Assert\NotBlank]
    private ?string $text = null;

    #[ORM\Column(type: 'text')]
    #[Assert\NotBlank]
    private ?string $response = null;

    #[ORM\Column(enumType: AiRequestType::class)]
    #[Assert\NotNull]
    private ?AiRequestType $type = null;

    #[ORM\Column]
    #[ApiProperty(writable: false)]
    private ?\DateTimeImmutable $createdAt = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getText(): ?string
    {
        return $this->text;
    }

    public function setText(string $text): static
    {
        $this->text = $text;

        return $this;
    }

    public function getResponse(): ?string
    {
        return $this->response;
    }

    public function setResponse(string $response): static
    {
        $this->response = $response;

        return $this;
    }

    public function getType(): ?AiRequestType
    {
        return $this->type;
    }

    public function setType(?AiRequestType $type): static
    {
        $this->type = $type;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): static
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable();
    }
}
