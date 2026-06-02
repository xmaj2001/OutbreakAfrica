import { useState, useEffect } from "react";

/**
 * Hook para animar um número de 0 até o valor alvo (targetValue).
 *
 * @param targetValue O número final onde a animação deve parar.
 * @param durationAms A duração total da animação em milissegundos (padrão: 1500ms).
 */
export function useAnimatedNumber(
  targetValue: number,
  durationMs: number = 1500,
) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    // Se o valor for 0, não há o que animar
    if (targetValue === 0) {
      setValue(0);
      return;
    }

    let startTime: number | null = null;
    let animationFrameId: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;

      // Calcula o tempo decorrido
      const timeElapsed = currentTime - startTime;

      // Calcula o progresso da animação (entre 0 e 1)
      const progress = Math.min(timeElapsed / durationMs, 1);

      // Função de "Easing" (Ese-Out) para desacelerar suavemente no final
      // Se preferir uma subida linear, basta usar: const easeProgress = progress;
      const easeOutQuad = (t: number) => t * (2 - t);
      const easeProgress = easeOutQuad(progress);

      // Calcula o valor atual com base no progresso
      const currentValue = Math.floor(easeProgress * targetValue);
      setValue(currentValue);

      // Se ainda não chegou ao fim do tempo, continua a animação
      if (timeElapsed < durationMs) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setValue(targetValue); // Garante que termina exatamente no número alvo
      }
    };

    // Inicia a animação
    animationFrameId = requestAnimationFrame(animate);

    // Limpa a animação se o componente for desmontado ou o targetValue mudar
    return () => cancelAnimationFrame(animationFrameId);
  }, [targetValue, durationMs]);

  return value;
}
