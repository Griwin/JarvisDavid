<?php

declare(strict_types=1);

namespace App\Controller;

use App\DTO\TranslateRequest;
use App\Entity\AiRequest;
use App\Enum\AiRequestType;
use App\Service\Translation\TranslationException;
use App\Service\Translation\TranslationProviderInterface;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;

final class TranslateController extends AbstractController
{
    #[Route('/api/translate', name: 'api_translate', methods: ['POST'])]
    public function translate(
        #[MapRequestPayload] TranslateRequest $request,
        TranslationProviderInterface $translationProvider,
        EntityManagerInterface $entityManager,
    ): JsonResponse {
        try {
            $translatedText = $translationProvider->translate(
                $request->text,
                $request->sourceLanguage,
                $request->targetLanguage,
                $request->tone,
            );
        } catch (TranslationException $exception) {
            return $this->json([
                'error' => [
                    'code' => 'translation_unavailable',
                    'message' => $exception->getMessage(),
                ],
            ], Response::HTTP_SERVICE_UNAVAILABLE);
        }

        $aiRequest = (new AiRequest())
            ->setText($request->text)
            ->setResponse($translatedText)
            ->setType(AiRequestType::TRANSLATE);

        $entityManager->persist($aiRequest);
        $entityManager->flush();

        return $this->json([
            'translatedText' => $translatedText,
            'meta' => [
                'sourceLanguage' => $request->sourceLanguage,
                'targetLanguage' => $request->targetLanguage,
                'tone' => $request->tone,
            ],
        ]);
    }
}
