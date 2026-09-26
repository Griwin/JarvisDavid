<?php

declare(strict_types=1);

namespace App\Controller;

use App\DTO\SummarizeRequest;
use App\Entity\AiRequest;
use App\Enum\AiRequestType;
use App\Service\Summarization\SummarizationException;
use App\Service\Summarization\SummarizationProviderInterface;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;

final class SummarizeController extends AbstractController
{
    #[Route('/api/summarize', name: 'api_summarize', methods: ['POST'])]
    public function summarize(
        #[MapRequestPayload] SummarizeRequest $request,
        SummarizationProviderInterface $summarizationProvider,
        EntityManagerInterface $entityManager,
    ): JsonResponse {
        try {
            $summaryText = $summarizationProvider->summarize($request->text);
        } catch (SummarizationException $exception) {
            return $this->json([
                'error' => [
                    'code' => 'summarization_unavailable',
                    'message' => $exception->getMessage(),
                ],
            ], Response::HTTP_SERVICE_UNAVAILABLE);
        }

        $aiRequest = (new AiRequest())
            ->setText($request->text)
            ->setResponse($summaryText)
            ->setType(AiRequestType::SUMMARIZE);

        $entityManager->persist($aiRequest);
        $entityManager->flush();

        return $this->json(['summaryText' => $summaryText]);
    }
}
