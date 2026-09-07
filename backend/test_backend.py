from app.data_ingestion import fetch_noaa_ghcnh_data
from app.evaluator import run_evaluation_benchmark
from app.stream_engine import WeatherStreamEngine

print("[TEST] Fetching NOAA dataset...")
df = fetch_noaa_ghcnh_data(days=5)
print(f"[TEST] NOAA Dataset shape: {df.shape}")

print("[TEST] Running Stream Engine Ticks...")
engine = WeatherStreamEngine()
t1 = engine.tick()
print("[TEST] Tick 1 sample:", t1["temperature"], t1["quality_flag"], t1["anomaly_score"])

print("[TEST] Running Evaluation Benchmark...")
metrics = run_evaluation_benchmark(n_samples=50)
print("[TEST] Benchmark output:", metrics)
print("[TEST] ALL BACKEND TESTS PASSED!")
