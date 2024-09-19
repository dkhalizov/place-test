use crate::error::ServiceError;
use rdkafka::config::ClientConfig;

pub fn get_kafka_config() -> Result<ClientConfig, ServiceError> {
    let mut kafka_config = ClientConfig::new();
    kafka_config
        .set("group.id", "websocket_service")
        .set("bootstrap.servers", "localhost:9092")
        .set("enable.auto.commit", "true");

    Ok(kafka_config)
}